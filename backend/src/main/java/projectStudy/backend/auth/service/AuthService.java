package projectStudy.backend.auth.service;

import java.util.Optional;

import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import projectStudy.backend.auth.dto.ChangePasswordRequest;
import projectStudy.backend.auth.dto.LoginRequest;
import projectStudy.backend.auth.dto.LoginResponse;
import projectStudy.backend.auth.dto.MeResponse;
import projectStudy.backend.auth.dto.RegisterRequest;
import projectStudy.backend.auth.dto.RegisterResponse;
import projectStudy.backend.auth.dto.UpdateProfileRequest;
import projectStudy.backend.auth.entity.UserEntity;
import projectStudy.backend.auth.repository.UserRepository;

@Service
@RequiredArgsConstructor 
public class AuthService {
    
    private final static String STATUS_ACTIVE = "ACTIVE"; //thể hiện tình trạng hoạt động/ko hoạt động của tài khoản
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterResponse registerResponse(RegisterRequest registerRequest) {
        
        //kiểm tra xem username, email hoặc sdt đã tồn tại hay chưa
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        if (userRepository.existsByPhoneNumber(registerRequest.getPhoneNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Phone number already exists");
        }

        //tạo thêm user mới để truy cập trang web 
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(registerRequest.getUsername());
        userEntity.setFirstName(registerRequest.getFirstName());
        userEntity.setLastName(registerRequest.getLastName());
        userEntity.setEmail(registerRequest.getEmail());
        userEntity.setPhoneNumber(registerRequest.getPhoneNumber());
        userEntity.setAddress(registerRequest.getAddress());
        userEntity.setDateOfBirth(registerRequest.getDateOfBirth());
        userEntity.setGender(registerRequest.getGender());
        userEntity.setRole("LEARNER");
        userEntity.setEmailVerified(false);
        userEntity.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));

        //trả về dữ liệu người dùng
        UserEntity savedUserEntity = userRepository.save(userEntity);
        sendEmailVerificationCode(savedUserEntity.getEmail());
        return RegisterResponse.from(savedUserEntity);
    }

    public LoginResponse loginResponse(LoginRequest loginRequest) {

        String identifier = loginRequest.getIdentifier().trim();

        //kiểm tra xem username hay email đó có tồn tại hay không, có @ là mail, ko thì username
        Optional<UserEntity> identify = identifier.contains("@") 
                ? userRepository.findByEmail(identifier.toLowerCase().trim()) 
                : userRepository.findByUsername(identifier);

        UserEntity userEntity = identify.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email/username or password."));


        //kiểm tra xem password này có chính xác ko
        if(!passwordEncoder.matches(loginRequest.getPassword(), userEntity.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password!");
        }

        //kiểm tra xem tài khoản còn hoạt động ko
        if(!STATUS_ACTIVE.equals(userEntity.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is no longer active.");
        }

        return LoginResponse.from(userEntity, STATUS_ACTIVE, STATUS_ACTIVE);
    }

    public MeResponse updateProfile(String username, UpdateProfileRequest updateProfileRequest) {

        //kiểm tra xem user còn tồn tại ko
        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password!"));

        String phoneNumber = (updateProfileRequest.getPhoneNumber() == null || updateProfileRequest.getPhoneNumber().isBlank()) ? null : updateProfileRequest.getPhoneNumber().trim();

        //kiểm tra xem liệu số điện thoại nhập vào đã có sẵn hay chưa
        if (phoneNumber != null && !phoneNumber.equals(userEntity.getPhoneNumber()) && userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Phone number already exists");
        }

        String newUsername = updateProfileRequest.getUsername().trim();
        String newEmail = updateProfileRequest.getEmail().toLowerCase().trim();

        if(!newUsername.equals(userEntity.getUsername()) && userRepository.existsByUsername(newUsername)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }

        if(!newEmail.equals(userEntity.getEmail()) && userRepository.existsByEmail(newEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        userEntity.setUsername(updateProfileRequest.getUsername().trim());
        userEntity.setFirstName(updateProfileRequest.getFirstName().trim());
        userEntity.setLastName(updateProfileRequest.getLastName().trim());
        userEntity.setEmail(updateProfileRequest.getEmail().trim());
        userEntity.setPhoneNumber(phoneNumber);
        userEntity.setAddress(updateProfileRequest.getAddress());

        return MeResponse.from(userEntity);
    }

    public MeResponse getMe(String username) {
        
        //tìm theo username, nếu không có thì trả về lỗi
        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User no longer exists"));

        return MeResponse.from(userEntity);        
    }

    public void changePassword(String username, String email, ChangePasswordRequest changePasswordRequest) {

        //nhập email để thay đổi mật khẩu
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email no longer exists"));

        if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), userEntity.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }  
        
        if (passwordEncoder.matches(changePasswordRequest.getNewPassword(), userEntity.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password must be different from the old password");
        }

        userEntity.setPasswordHash(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepository.save(userEntity);
    }

    
}

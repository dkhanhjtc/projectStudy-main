package projectStudy.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import projectStudy.backend.auth.entity.UserEntity;

@Getter 
@AllArgsConstructor 
public class MeResponse {
    
    private String id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private java.time.LocalDate dateOfBirth;
    private String gender;
    private String role;
    private boolean emailVerified;

    public static MeResponse from (UserEntity userEntity) {
        return new MeResponse(
            userEntity.getId(),
            userEntity.getUsername(),
            userEntity.getFirstName(),
            userEntity.getLastName(),
            userEntity.getEmail(),
            userEntity.getPhoneNumber(),
            userEntity.getAddress(),
            userEntity.getDateOfBirth(),
            userEntity.getGender(),
            userEntity.getRole(),
            userEntity.isEmailVerified()
        );
    }
}

package projectStudy.backend.auth.dto;

import projectStudy.backend.auth.entity.UserEntity;  
import lombok.Data;

@Data 
public class RegisterResponse {
    private String id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private String gender;
    private String dateOfBirth;

    public static RegisterResponse of(UserEntity userEntity) {
        RegisterResponse response = new RegisterResponse();
        response.setId(userEntity.getId());
        response.setEmail(userEntity.getEmail());
        response.setPhoneNumber(userEntity.getPhoneNumber());
        response.setFirstName(userEntity.getFirstName());
        response.setLastName(userEntity.getLastName());
        response.setUsername(userEntity.getUsername());
        response.setAddress(userEntity.getAddress());
        response.setGender(userEntity.getGender());
        response.setDateOfBirth(String.valueOf(userEntity.getDateOfBirth()));
        return response;
    }
}

package projectStudy.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import projectStudy.backend.auth.entity.UserEntity;

@AllArgsConstructor 
@Getter 
public class LoginResponse {
    
    private String username;
    private String email;
    private String token;
    private String refreshToken;

    public static LoginResponse from (UserEntity userEntity, String token, String refreshToken) {
        return new LoginResponse(userEntity.getUsername(), userEntity.getEmail(), token, refreshToken);
    }
}

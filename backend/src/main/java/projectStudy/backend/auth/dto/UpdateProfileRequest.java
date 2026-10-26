package projectStudy.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data 
public class UpdateProfileRequest {

    @NotBlank (message = "Username is required")
    @Size (min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    @Pattern(regexp = "^[a-zA-Z0-9._]+$", message = "Username can only contain letters, numbers, dots and underscores")
    private String username;       

    @NotBlank(message = "First name is required")
    @Pattern (regexp = "^[a-zA-ZÀ-ỹ\\s]+$", message = "First name should contain only letters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Pattern (regexp = "^[a-zA-ZÀ-ỹ\\s]+$", message = "Last name should contain only letters")
    private String lastName;

    @NotBlank(message = "Email is required")   
    @Email(message = "Email should be valid")
    private String email;      
    
    @Pattern(regexp = "^0[0-9]{9}$", message = "Phone number should be valid")
    private String phoneNumber;
    
    private String address;      
}

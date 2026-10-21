package projectStudy.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data 
public class UpdateProfileRequest {

    @NotBlank(message = "First name is required")
    @Pattern (regexp = "^[a-zA-ZÀ-ỹ\\s]+$", message = "First name should contain only letters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Pattern (regexp = "^[a-zA-ZÀ-ỹ\\s]+$", message = "Last name should contain only letters")
    private String lastName;

    @NotBlank (message = "Username is required")
    @Size (min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;    
    
    @Pattern(regexp = "^0[0-9]{9}$", message = "Phone number should be valid")
    private String phoneNumber;
    
    private String address;      
}

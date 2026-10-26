package projectStudy.backend.auth.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "users")
public class UserEntity {
    
    @Id 
    private String id;

    @Indexed(unique = true)
    private String username;

    private String firstName;

    private String lastName;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true)
    private String phoneNumber;

    private String address;

    private java.time.LocalDate dateOfBirth;    

    private String gender;

    private String role;

    private String status;

    private boolean emailVerified;

    private String passwordHash;
}

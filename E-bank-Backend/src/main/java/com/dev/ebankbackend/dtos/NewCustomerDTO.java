package com.dev.ebankbackend.dtos;
import lombok.Data;
@Data
public class NewCustomerDTO {
    private Long id;
    private String name;
    private String email;
    private String password;
}

package com.dev.ebankbackend.dtos;

import lombok.Data;

@Data
public class CustomerLoginDTO {
    private Long id;
    private String email;
    private String password;
}

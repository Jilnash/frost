package com.jilnash.model;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.UniqueElements;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Role role;

//    @Pattern(regexp = "", message = "Неправильный формат почты")
    @NotNull(message = "Задайте почту")
//    @UniqueElements(message = "Аккаунт с такой почтой уже существует")
    private String email;

//    @Pattern(regexp = "", message = "Неправильный формат пароля")
    @Size(min = 8, message = "Размер пароля меньше 8")
    @NotNull(message = "Задайте пароль")
    private String password;

    @NotNull(message = "Задайте имя")
    private String name;

    @NotNull(message = "Задайте фамилию")
    private String surname;

    private String patronymic;

    private String phone;

    @ManyToOne
    private Country country;

    @ManyToOne
    private Region region;

    private String city;

    private String street;

    private String house;

    private String flat;

    @OneToMany(mappedBy = "user")
    List<Order> orders;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;
}

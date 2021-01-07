package com.jilnash.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.UniqueElements;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String status;

    @NotNull(message = "Задайте имя")
//    @Pattern(regexp = "", message = "")
    private String name;

    @NotNull(message = "Задайте фамилию")
//    @Pattern(regexp = "", message = "")
    private String surname;

    @NotNull(message = "Задайте отчество")
//    @Pattern(regexp = "", message = "")
    private String patronymic;

    @NotNull(message = "Задайте номер телефона")
//    @Pattern(regexp = "", message = "")
    private String phone;

    @NotNull(message = "Задайте регион")
//    @Pattern(regexp = "", message = "")
    @ManyToOne
    private Region region;

    @NotNull(message = "Задайте город")
//    @Pattern(regexp = "", message = "")
    private String city;

    @NotNull(message = "Задайте улицу")
//    @Pattern(regexp = "", message = "")
    private String street;

    @NotNull(message = "Задайте дом")
//    @Pattern(regexp = "", message = "")
    private String house;

    private String flat;

    @JsonIgnore
    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "order")
    private List<OrderContent> orderContents;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;
}

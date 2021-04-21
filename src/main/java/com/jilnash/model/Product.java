package com.jilnash.model;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.validation.constraints.NotNull;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Category category;

    @NotNull(message = "Задайте имя")
    private String name;

    @NotNull(message = "Задайте артикул")
    private String article;

    @NotNull(message = "Задайте производителя")
    private String manufacturer;

    @NotNull(message = "Задайте описание")
    private String description;

    @NotNull(message = "Задайте цену")
    private Double price;

    @CreationTimestamp
    @Column(name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    @OneToMany(mappedBy = "product")
    private List<ProductGeneration> productGenerations;

    @OneToMany(mappedBy = "product")
    private List<Comment> comments;

    @OneToMany(mappedBy = "product")
    private List<Instock> instocks;
}

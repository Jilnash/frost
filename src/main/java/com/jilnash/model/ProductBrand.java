package com.jilnash.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "products_brands")
public class ProductBrand {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull(message = "Задайте марку")
    @ManyToOne
    private Brand brand;

    @NotNull(message = "Задайте продукт")
    @ManyToOne
    @JsonIgnore
    private Product product;
}

package com.jilnash.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "products_generations")
public class  ProductGeneration{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Задайте поколение")
    @ManyToOne
    private Generation generation;

    @NotNull(message = "Задайте продукт")
    @ManyToOne
    @JsonIgnore
    private Product product;
}

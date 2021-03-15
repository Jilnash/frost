package com.jilnash.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "stocks")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}

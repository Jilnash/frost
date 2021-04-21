package com.jilnash.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "statuses")
public class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}

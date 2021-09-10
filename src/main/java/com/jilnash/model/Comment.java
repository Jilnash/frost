package com.jilnash.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    @ManyToOne
    @JsonIgnore
    private User user;

    transient private String name;

    @ManyToOne
    @JsonIgnore
    private Product product;

    public String getName() {

        String patron = user.getPatronymic();

        if(patron == null)
            patron = "";

        return user.getName() + " " + user.getSurname() + " " + patron;
    }
}

package com.jilnash.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@Entity
@Table(name = "generations")
public class Generation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Задайте имя поколению")
    private String name;

    @NotNull
    @ManyToOne
    @JsonIgnore
    private Model model;

    @OneToMany(mappedBy = "generation")
    List<Type> types;
}

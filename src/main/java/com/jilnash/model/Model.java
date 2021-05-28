package com.jilnash.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@Entity
@Table(name = "models")
public class Model {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Задайте имя модели")
    private String name;

    @NotNull(message = "Задайте марку")
    @ManyToOne
    @JsonIgnore
    private Brand brand;

    @OneToMany(mappedBy = "model")
    private List<Generation> generations;

    public boolean equals(Model model) {

        return this.id.equals(model.getId());
    }
}

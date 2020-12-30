package com.jilnash.repository;

import com.jilnash.model.Brand;
import com.jilnash.model.Model;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModelRepository extends JpaRepository<Model, Long> {

    List<Model> findAllByBrand(Brand brand);

    Model findByName(String name);
}

package com.jilnash.repository;

import com.jilnash.model.Instock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstockRepository extends JpaRepository<Instock, Long> {
}

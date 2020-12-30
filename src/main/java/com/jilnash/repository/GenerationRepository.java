package com.jilnash.repository;

import com.jilnash.model.Generation;
import com.jilnash.model.Model;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GenerationRepository extends JpaRepository<Generation, Long> {

    List<Generation> findAllByModel(Model model);
}

package com.jilnash.repository;

import com.jilnash.model.Generation;
import com.jilnash.model.Product;
import com.jilnash.model.ProductGeneration;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

@Transactional
public interface ProductGenerationRepository extends JpaRepository<ProductGeneration, Long> {

    void deleteProductGenerationByProduct(Product product);

    void deleteProductGenerationByGeneration(Generation generation);
}

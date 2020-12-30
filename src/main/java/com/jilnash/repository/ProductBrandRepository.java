package com.jilnash.repository;

import com.jilnash.model.ProductBrand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductBrandRepository extends JpaRepository<ProductBrand, Long> {
}

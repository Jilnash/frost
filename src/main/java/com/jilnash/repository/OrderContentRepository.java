package com.jilnash.repository;

import com.jilnash.model.OrderContent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderContentRepository extends JpaRepository<OrderContent, Long> {
}

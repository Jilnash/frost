package com.jilnash.repository;

import com.jilnash.model.Instock;
import com.jilnash.model.Product;
import com.jilnash.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

@Transactional
public interface InstockRepository extends JpaRepository<Instock, Long> {

    void deleteInstocksByProduct(Product product);

    void deleteInstocksByStock(Stock stock);
}

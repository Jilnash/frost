package com.jilnash.repository;

import com.jilnash.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegionRepository extends JpaRepository<Region, Long> {

    Region findByName(String name);
}

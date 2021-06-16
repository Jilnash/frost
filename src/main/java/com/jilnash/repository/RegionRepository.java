package com.jilnash.repository;

import com.jilnash.model.Country;
import com.jilnash.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegionRepository extends JpaRepository<Region, Long> {

    Region findByName(String name);

    List<Region> findAllByCountry(Country country);

    void deleteAllByCountry(Country country);
}

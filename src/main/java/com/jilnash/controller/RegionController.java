package com.jilnash.controller;

import com.jilnash.model.Region;
import com.jilnash.repository.CountryRepository;
import com.jilnash.repository.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/region")
public class RegionController {

    @Autowired
    RegionRepository regionRepository;

    @Autowired
    CountryRepository countryRepository;

    @GetMapping("/all")
    public List<Region> getRegions(@RequestParam(name = "country", required = false) String name) {

        if(name == null)
            return regionRepository.findAll();

        return regionRepository.findAllByCountry(countryRepository.findByName(name));
    }

    @PostMapping("/{id}/save")
    public void saveRegion(@PathVariable Long id,
                           @RequestParam(name = "name") String name,
                           @RequestParam(name = "parent", required = false) Long parent) {

        Region r = null;

        if (id != -1)
            r = regionRepository.getOne(id);
        else
            r = new Region();

        r.setName(name);
        r.setCountry(countryRepository.getOne(parent));
        regionRepository.save(r);
    }

    @PostMapping("/{id}/delete")
    public void deleteRegion(@PathVariable Long id) {

        Region r = regionRepository.getOne(id);

        regionRepository.delete(r);
    }
}

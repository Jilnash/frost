package com.jilnash;

import com.jilnash.model.Country;
import com.jilnash.repository.CountryRepository;
import com.jilnash.repository.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/country")
public class CountryController {

    @Autowired
    CountryRepository countryRepository;

    @Autowired
    RegionRepository regionRepository;

    @GetMapping("/all")
    public List<Country> getCountries() {

        return countryRepository.findAll();
    }

    @PostMapping("/{id}/save")
    public void saveCountry(@PathVariable Long id,
                            @RequestParam(name = "name") String name) {

        Country c = null;

        if (id != -1)
            c = countryRepository.getOne(id);
        else
            c = new Country();

        c.setName(name);
        countryRepository.save(c);
    }

    @PostMapping("/{id}/delete")
    public void deleteCountry(@PathVariable Long id) {

        Country c = countryRepository.getOne(id);

        regionRepository.deleteAllByCountry(c);

        countryRepository.delete(c);
    }
}

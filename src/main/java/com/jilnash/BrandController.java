package com.jilnash;

import com.jilnash.model.Brand;
import com.jilnash.repository.BrandRepository;
import com.jilnash.repository.GenerationRepository;
import com.jilnash.repository.ModelRepository;
import com.jilnash.repository.ProductGenerationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/brand")
public class BrandController {


    @Autowired
    BrandRepository brandRepository;

    @Autowired
    ModelRepository modelRepository;

    @Autowired
    GenerationRepository generationRepository;

    @Autowired
    ProductGenerationRepository productGenerationRepository;

    @GetMapping("/all")
    public List<Brand> getBrands() {

        return brandRepository.findAll();
    }

    @PostMapping("/{id}/save")
    public void saveBrand(@PathVariable Long id,
                          @RequestParam(name = "name") String name) {

        Brand b = null;

        if (id != -1)
            b = brandRepository.getOne(id);
        else
            b = new Brand();

        b.setName(name);
        brandRepository.save(b);
    }

    @PostMapping("/{id}/delete")
    public void deleteBrand(@PathVariable Long id) {

        Brand b = brandRepository.getOne(id);

        b.getModels().forEach(m -> {

            m.getGenerations().forEach(g -> {

                productGenerationRepository.deleteProductGenerationByGeneration(g);
                generationRepository.delete(g);
            });

            modelRepository.delete(m);
        });

        brandRepository.delete(b);
    }
}

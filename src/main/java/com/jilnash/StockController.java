package com.jilnash;

import com.jilnash.model.Stock;
import com.jilnash.repository.InstockRepository;
import com.jilnash.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stock")
public class StockController {

    @Autowired
    StockRepository stockRepository;

    @Autowired
    InstockRepository instockRepository;

    @GetMapping("/all")
    public List<Stock> getStocks() {

        return stockRepository.findAll();
    }

    @PostMapping("/{id}/save")
    public void saveStock(@PathVariable Long id,
                         @RequestParam(name = "name") String name,
                         @RequestParam(name = "parent", required = false) Long parent) {

        Stock s = null;

        if (id != -1)
            s = stockRepository.getOne(id);
        else
            s = new Stock();

        s.setName(name);
        stockRepository.save(s);
    }

    @PostMapping("/stock/{id}/delete")
    public void deleteStock(@PathVariable Long id) {

        Stock s = stockRepository.getOne(id);

        instockRepository.deleteInstocksByStock(s);
        stockRepository.delete(s);
    }
}

package com.example.dinustastyapi.repository;

import com.example.dinustastyapi.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(String status);
    List<Order> findByPhone(String phone);
}
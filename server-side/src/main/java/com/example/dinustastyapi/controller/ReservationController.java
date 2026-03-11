package com.example.dinustastyapi.controller;

import com.example.dinustastyapi.model.Reservation;
import com.example.dinustastyapi.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @GetMapping("/status/{status}")
    public List<Reservation> getByStatus(@PathVariable String status) {
        return reservationRepository.findByStatus(status);
    }

    @PostMapping
    public Reservation makeReservation(@RequestBody Reservation reservation) {
        reservation.setStatus("pending");
        return reservationRepository.save(reservation);
    }

    @PutMapping("/{id}/status")
    public Reservation updateStatus(@PathVariable Long id, @RequestParam String status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationRepository.deleteById(id);
    }
}
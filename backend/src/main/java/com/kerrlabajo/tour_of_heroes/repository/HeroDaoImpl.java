package com.kerrlabajo.tour_of_heroes.repository;

import com.kerrlabajo.tour_of_heroes.model.Hero;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class HeroDaoImpl implements HeroDao{

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<Hero> getAllHeroes() {
        return jdbcTemplate.query(
                "SELECT * FROM heroes",
                new BeanPropertyRowMapper<>(Hero.class)
        );
    }

    @Override
    public Hero getHeroById(int id) {
        return jdbcTemplate.queryForObject(
                "SELECT * FROM heroes WHERE id = ?",
                new Object[]{id},
                new BeanPropertyRowMapper<>(Hero.class)
        );
    }

    @Override
    public Hero addHero(Hero hero) {
        return jdbcTemplate.queryForObject(
                "INSERT INTO heroes (name) VALUES (?) RETURNING *",
                new Object[]{hero.getName()},
                new BeanPropertyRowMapper<>(Hero.class)
        );
    }

    @Override
    public Hero updateHero(Hero hero) {
        return jdbcTemplate.queryForObject(
                "UPDATE heroes SET name = ? WHERE id = ? RETURNING *",
                new Object[]{hero.getName(), hero.getId()},
                new BeanPropertyRowMapper<>(Hero.class)
        );
    }

    @Override
    public Hero deleteHero(int id) {
        return jdbcTemplate.queryForObject(
                "DELETE FROM heroes WHERE id = ? RETURNING *",
                new Object[]{id},
                new BeanPropertyRowMapper<>(Hero.class)
        );
    }
}

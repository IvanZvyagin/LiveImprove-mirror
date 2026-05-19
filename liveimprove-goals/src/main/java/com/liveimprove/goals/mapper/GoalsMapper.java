package com.liveimprove.goals.mapper;

import com.liveimprove.goals.dto.response.GoalItemResponse;
import com.liveimprove.goals.dto.response.GoalResponse;
import com.liveimprove.goals.entity.GoalEntity;
import com.liveimprove.goals.entity.SubgoalEntity;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

/**
 * Mapper для преобразования сущностей goals в response DTO.
 * Содержит только простое отображение полей без бизнес-логики и вычислений статистики.
 */
@Component
public class GoalsMapper {

    /**
     * Преобразует сущность цели в DTO для активной цели.
     * Поля представления (timeLeft/accent/icon/iconType) здесь не вычисляются
     * и остаются null для дальнейшего заполнения в assembler/сервисе.
     *
     * @param goal сущность цели
     * @return DTO цели
     */
    public GoalResponse toGoalResponse(GoalEntity goal) {
        return new GoalResponse(
                goal.getId(),
                goal.getTitle(),
                goal.getCategory(),
                0,
                goal.getTargetDate() != null ? goal.getTargetDate().toString() : null,
                null,
                null,
                null,
                null,
                toGoalItemResponses(goal.getItems())
        );
    }

    /**
     * Преобразует список сущностей целей в список DTO.
     *
     * @param goals список сущностей целей
     * @return список DTO, либо пустой список при null/empty входе
     */
    public List<GoalResponse> toGoalResponses(List<GoalEntity> goals) {
        if (goals == null || goals.isEmpty()) return List.of();
        return goals.stream().map(this::toGoalResponse).toList();
    }

    /**
     * Преобразует подцель в DTO подцели.
     * Дата формируется из createdAt в формате yyyy-MM-dd (UTC).
     *
     * @param item сущность подцели
     * @return DTO подцели
     */
    public GoalItemResponse toGoalItemResponse(SubgoalEntity item) {
        return new GoalItemResponse(
                item.getId(),
                item.getTitle(),
                item.getCreatedAt() != null ? LocalDate.ofInstant(item.getCreatedAt(), ZoneOffset.UTC).toString() : null,
                item.isCompleted()
        );
    }

    /**
     * Преобразует список подцелей в список DTO.
     *
     * @param items список сущностей подцелей
     * @return список DTO, либо пустой список при null/empty входе
     */
    public List<GoalItemResponse> toGoalItemResponses(List<SubgoalEntity> items) {
        if (items == null || items.isEmpty()) return List.of();
        return items.stream().map(this::toGoalItemResponse).toList();
    }
}

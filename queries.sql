SELECT player_name, position, cast(jersey_number as int) as jersey_number, week, headshot_url,
case 
    when position = 'QB' then 'Offense'
    when position = 'RB' then 'Offense'
    when position = 'WR' then 'Offense'
    when position = 'TE' then 'Offense'
    when position = 'OL' then 'Offense'
    when position = 'DL' then 'Defense'
    when position = 'LB' then 'Defense'
    when position = 'DB' then 'Defense'
    when position = 'LS' then 'Special Teams'
    when position = 'K' then 'Special Teams'
    when position = 'P' then 'Special Teams'
    else 'Unknown'
end as team_side
FROM roster;
SELECT distinct position FROM roster;

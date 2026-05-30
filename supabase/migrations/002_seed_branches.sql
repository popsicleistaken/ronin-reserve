-- ============================================================
-- Ronin Reserve — Seed Branch Data
-- Run AFTER 001_create_tables.sql
-- ============================================================

insert into branches (name, slug, address, phone, opening_time, closing_time, capacity_per_slot, is_active)
values
  (
    'Ronin Pizza Ladprao 18',
    'ladprao-18',
    '18 Ladprao Road, Chatuchak, Bangkok 10900',
    '02-xxx-xxxx',
    '11:00',
    '21:00',
    30,
    true
  ),
  (
    'Ronin Pizza Sukhumvit 34',
    'sukhumvit-34',
    '34 Sukhumvit Road, Khlong Toei, Bangkok 10110',
    '02-xxx-xxxx',
    '11:00',
    '21:00',
    30,
    true
  ),
  (
    'Ronin Pizza Ari',
    'ari',
    'Ari BTS Area, Phahon Yothin Road, Phaya Thai, Bangkok 10400',
    '02-xxx-xxxx',
    '11:00',
    '21:00',
    30,
    true
  ),
  (
    'Ronin Pizza Phayathai',
    'phayathai',
    'Phayathai Road, Ratchathewi, Bangkok 10400',
    '02-xxx-xxxx',
    '11:00',
    '21:00',
    30,
    true
  );

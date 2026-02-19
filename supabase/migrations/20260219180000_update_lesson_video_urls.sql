-- Update lessons for 'Mastering Figma' course with sample Vimeo embed URL for testing
UPDATE lessons 
SET video_url = 'https://player.vimeo.com/video/1155226634?badge=0&autopause=0&player_id=0&app_id=58479'
WHERE module_id IN (
    SELECT id FROM modules WHERE course_id IN (
        SELECT id FROM courses WHERE title LIKE 'Mastering Figma%'
    )
);

-- Update lessons for 'Smart Betting 101' course with sample Vimeo embed URL for testing
UPDATE lessons 
SET video_url = 'https://player.vimeo.com/video/1155226634?badge=0&autopause=0&player_id=0&app_id=58479'
WHERE module_id IN (
    SELECT id FROM modules WHERE course_id IN (
        SELECT id FROM courses WHERE title LIKE 'Smart Betting 101%'
    )
);

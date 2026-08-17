/*
# Fix incorrect image URLs for service cards

Corrects the 3rd and 8th service card images that were mistakenly set
to non-image values ("mission and popular destinations" / "mission").
*/

UPDATE service_cards
SET image_url = 'https://images.pexels.com/photos/3156647/pexels-photo-3156647.jpeg?auto=compress&cs=tinysrgb&w=900',
    updated_at = now()
WHERE sort_order = 3;

UPDATE service_cards
SET image_url = 'https://images.pexels.com/photos/6863259/pexels-photo-6863259.jpeg?auto=compress&cs=tinysrgb&w=900',
    updated_at = now()
WHERE sort_order = 8;

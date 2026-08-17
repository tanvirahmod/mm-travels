/*
# Add service_charge column to visa_requirements

Adds an optional service charge field so the admin can set
a custom service fee per visa requirement. The /visa/:id page
will use this value for the Cost Summary card.
*/

ALTER TABLE visa_requirements
ADD COLUMN IF NOT EXISTS service_charge decimal DEFAULT 0;

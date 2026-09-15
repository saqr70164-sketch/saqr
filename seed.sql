-- Sample data (works for Postgres/MySQL; for SQLite adapt JSON as string)
INSERT INTO case_studies (title, summary, full_story, industry, key_metrics, hero_image_url, published)
VALUES
('زيادة المبيعات لمنصة تجارة إلكترونى', 'خفّضنا تكاليف الإعلانات وزدنا التحويل', 'تفاصيل العمل ...', 'ecommerce', '{"roi_pct":150,"cost_saved":1200,"time_saved_weeks":4}', 'https://example.com/img1.jpg', true),
('تحسين أداء خدمة عملاء لمزود SaaS', 'قلّلنا زمن الرد وزدنا رضا العملاء', 'تفاصيل العمل ...', 'saas', '{"roi_pct":80,"response_time_reduction_mins":30}', 'https://example.com/img2.jpg', true),
('تسريع إطلاق منتج لشركة ناشئة', 'أطلقنا المنتج خلال 6 أسابيع بدلاً من 12', 'تفاصيل العمل ...', 'startup', '{"time_saved_weeks":6,"cost_saved":8000}', 'https://example.com/img3.jpg', true);

INSERT INTO testimonials (case_study_id, author_name, author_title, quote, photo_url)
VALUES
(1, 'أحمد علي', 'مدير تسويق', 'تحسّن ملحوظ في العائد على الإنفاق الإعلاني.', 'https://example.com/photo_ahmad.jpg'),
(2, 'سارة محمد', 'مديرة خدمة العملاء', 'انخفضت شكاوى العملاء بنسبة كبيرة.', 'https://example.com/photo_sara.jpg');

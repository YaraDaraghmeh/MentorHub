namespace MentorHup.Domain.Entities
{
    public class MentorSkill
    {
        public int MentorSkillId { get; set; }
        public int MentorId { get; set; }
        public Mentor Mentor { get; set; } = null!;

        public int SkillId { get; set; }
        public Skill Skill { get; set; } = null!;
    }
}

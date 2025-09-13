namespace MentorHup.Domain.Entities
{
    public class Skill
    {
        public int Id { get; set; }
        public string SkillName { get; set; } = null!;
        public ICollection<MentorSkill> MentorSkills { get; set; } = new List<MentorSkill>();
    }
}

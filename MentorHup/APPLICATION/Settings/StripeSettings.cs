namespace MentorHup.APPLICATION.Settings
{
    public class StripeSettings
    {
        public string PublishableKey { get; set; } = null!;
        public string SecretKey { get; set; } = null!;
        public string WebhookSecret { get; set; }
    }
}

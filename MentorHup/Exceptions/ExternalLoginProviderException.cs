namespace MentorHup.Exceptions
{
    /*
    // record-like constructor syntax (C# 11) 
    public class ExternalLoginProviderException(string provider, string message) : Exception($"External login provider: {provider} error occured: {message}")
    {
    }
    */

    public class ExternalLoginProviderException : Exception
    {
        public string Provider { get; init; }

        public ExternalLoginProviderException(string provider, string message)
            : base($"External login provider: {provider} error occurred: {message}")
        {
            Provider = provider;
        }
    }

}

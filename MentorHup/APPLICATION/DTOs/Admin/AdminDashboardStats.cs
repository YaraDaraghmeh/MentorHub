namespace MentorHup.APPLICATION.DTOs.Admin
{
    public class AdminDashboardStats
    {
        // Users
        public int TotalMentors { get; set; }
        public int TotalMentees { get; set; }
        public int TotalUsers => TotalMentors + TotalMentees + 1;
        public int ActiveUsers { get; set; } // users not soft-deleted (IsDeleted = false)
        //public int DeactiveUsers { get; set; } // users soft-deleted (IsDeleted = true) يعرض فقط النشطين ApplicationDbContext دايما رح تطلع صفر عشان رابطها بال
        public int BlockedUsers { get; set; } // (LockoutEnd > timeNow)
        public int EmailNotConfirmed { get; set; } 

        // Bookings
        public int TotalBookings { get; set; }
        public int ConfirmedBookings { get; set; }
        public int CancelledBookings { get; set; }

        // Reviews
        public int TotalReviews { get; set; }

        // Payments
        public decimal TotalPayments { get; set; } // assuming you have a Payment table
        public decimal AveragePayment { get; set; }
        public decimal MyWallet { get; set; }

        // Extra
        public int MentorsWithNoBookings { get; set; }
        public int NewUsersThisMonth { get; set; }

    }
}

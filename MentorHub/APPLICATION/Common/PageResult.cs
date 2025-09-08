namespace MentorHup.APPLICATION.Common
{
    public class PageResult<T>
    {
        public PageResult(IEnumerable<T> items, int totalCount, int pageSize, int pageNumber)
        {
            Items = items;
            TotalItemsCount = totalCount;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            ItemsFrom = (pageNumber - 1) * pageSize + 1;
            ItemsTo = Math.Min(ItemsFrom + pageSize - 1, totalCount);
        }
        public IEnumerable<T> Items { get; set; }
        public int TotalItemsCount { get; set; }
        public int TotalPages { get; set; }
        public int ItemsFrom { get; set; }
        public int ItemsTo { get; set; }

    }
}

using System;

namespace MyAngularApp.Data
{
    public class DBContext : DBContext
    {
        public DBContext(DbContextOptions<DBContext> options) : base(options)
        {
        }
    }

    public DbSet<Order> Orders { get; set; }
}
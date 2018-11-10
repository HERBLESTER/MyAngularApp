using Microsoft.EntityFrameworkCore;
using System;

namespace MyAngularApp.Domain
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {
        }

        public DbSet<Order> Orders { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAngularApp.Extensions
{
    public static class ForEachAsyncExtension
    {
        public static async Task ForEachAsync<T>(this List<T> list, Func<T, Task> func)
        {
            foreach (var value in list)
            {
                await func(value);
            }
        }
    }
}

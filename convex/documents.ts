import { v } from "convex/values"
import { mutation, query} from "./_generated/server"
import { Doc, Id} from "./_generated/dataModel"

export const Archive = mutation({
  args: { id: v.id("documents")},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if(!identity) {
      throw new Error("not authorized")
    }

    const userid = identity.subject

    const existingDocument = await ctx.db.get(args.id)

    if(!existingDocument) {
      throw new Error("Not Found")
    }

    if(existingDocument.userid !== userid) {
      throw new Error("Unauthorized")
    }

    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db.query("documents").withIndex("by_user_parent", q => 
          q.eq("userid", userid).eq("parentDocument", documentId)
      ).collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true
        })

        await recursiveArchive(child._id)
      } 
      
    }

    const document = await ctx.db.patch(args.id , {
      isArchived: true
    })
    recursiveArchive(args.id)
    return document
  }
})

export const GetSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if(!identity) {
      throw new Error("not authorized")
    }

    const userid = identity.subject

    const documents = ctx.db
    .query("documents")
    .withIndex("by_user_parent", (q) => q.eq("userid", userid).eq("parentDocument", args.parentDocument))
    .filter((q) => q.eq(q.field("isArchived"), false))
    .order("desc")
    .collect();

    return documents
  }
})




export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new Error("not authenticated")
        }

        const userid = identity.subject

        
        const documents = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userid: userid,
            isArchived: false,
            isPublished: false
        })

        return documents
    }
})
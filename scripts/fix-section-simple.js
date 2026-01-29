const {PrismaClient}=require("@prisma/client");
const prisma=new PrismaClient();

async function fixSections(){
  console.log("[INFO] Starting section fix...");
  const chapters=await prisma.chapter.findMany({
    where:{sutra:{slug:"platform-sutra"}},
    orderBy:{chapterNum:"asc"},
    include:{sections:{orderBy:{sectionNum:"asc"}}}
  });
  console.log("[INFO] Found "+chapters.length+" chapters");
  
  let totalDeleted=0,totalCreated=0;
  for(const chapter of chapters){
    const sections=chapter.sections;
    const newSections=[];
    let currentContent="";
    let currentHeading=null,currentModern=null,currentNotes=null,sectionNum=1;
    const MIN_SECTION_LENGTH=10,MAX_SECTION_LENGTH=300;
    
    for(const section of sections){
      const content=section.content?section.content.trim():";
      if(section.heading){
        if(currentContent.trim()&¤tContent.length>10){
          newSections.push({
            sectionNum:sectionNum++,
            heading:currentHeading,
            content:currentContent.trim(),
            modern:currentModern,
            notes:currentNotes
          });
          currentContent="";currentHeading=null;currentModern=null;currentNotes=null;
        }
        currentHeading=section.heading;
      }
      if(content){
        currentContent=currentContent?currentContent+"
"+content:content;
      }
      if(section.modern)currentModern=section.modern;
      if(section.notes)currentNotes=section.notes;
      if(currentContent.length>300){
        newSections.push({
          sectionNum:sectionNum++,
          heading:currentHeading,
          content:currentContent.trim(),
          modern:currentModern,
          notes:currentNotes
        });
        currentContent="";currentHeading=null;currentModern=null;currentNotes=null;
      }
    }
    if(currentContent.trim()){
      newSections.push({
        sectionNum:sectionNum++,
        heading:currentHeading,
        content:currentContent.trim(),
        modern:currentModern,
        notes:currentNotes
      });
    }
    console.log("[CHAPTER "+chapter.chapterNum+"] "+chapter.title);
    console.log("  Original: "+sections.length+" sections");
    console.log("  New: "+newSections.length+" sections");
    totalDeleted+=sections.length-newSections.length;
    totalCreated+=newSections.length;
    await prisma.section.deleteMany({where:{chapterId:chapter.id}});
    for(const section of newSections){
      await prisma.section.create({
        data:{
          chapterId:chapter.id,
          sectionNum:section.sectionNum,
          heading:section.heading,
          content:section.content,
          modern:section.modern,
          notes:section.notes
        }
      });
    }
    console.log("  Done");
  }
  
  console.log("[SUCCESS] Fixed!");
  console.log("  Deleted: "+totalDeleted+"," Created: "+totalCreated);
  console.log("  Reduced by: "+((totalDeleted/(totalDeleted+totalCreated))*100).toFixed(1)+"%");
  
  await prisma.$disconnect();
}

fixSections().catch(e=>{console.error(e);process.exit(1);});
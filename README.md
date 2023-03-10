# uTools_thesisTools 学术工具集

一些解决在查看论文中可能产生的诡异需求的工具。

## Letpub

在Letpub网站查询期刊的中科院分区情况。

使用方法：在uTools中使用关键字"letpub"。

【CCF查询】

查询期刊/会议在CCF 2022年发布的目录中的分区情况。使用方法：

- 在uTools中使用关键字"ccf"查询期刊/会议在《中国计算机学会推荐国际学术会议和期刊目录（2022年）》的等级。
- 在uTools中使用关键字"ccfz"或者"ccfc"查询期刊在《计算领域高质量科技期刊分级目录（2022年）》的等级。

参考： https://www.ccf.org.cn/Academic_Evaluation/By_category/

【条目修订】

修改了以下条目：
- HotSec: USENIX Workshop on Hot Topics in Security @ https://dblp.org/db/conf/uss
- dblp 网址链接统一采用 dblp.org
- 会议 ECML-PKDD 链接仅使用 https://dblp.org/db/conf/ecml
- 出版社 Association for Computational Linguistics 缩写为 ACL

增加了部分期刊会议的缩写：
- PARCO: Parallel Computing
- PEVA: Performance Evaluation
- CPE: Concurrency and Computation: Practice and Experience
- AdHoc: Ad Hoc Networks
- JOC: Journal of Cryptology
- CompSec: Computers & Security
- INS: Information Sciences
- CADE/IJCAR: International Conference on Automated Deduction/International Joint Conference on Automated Reasoning
- CoLi: Computational Linguistics
- EC: Evolutionary Computation
- JAR: Journal of Automated Reasoning

移除了部分会议期刊的缩写：
- Algorithmica
- Cognition

## pdf换行替换

从pdf中复制时，常常句子被换行分开了。

这个功能可以替换全半角、换行；在英文的情况下，替换连字符。

使用方法：

1. 从pdf正常复制,呼出uTools菜单。
2. 选择"替换pdf换行"
3. 正常粘贴

<!-- TODO: 处理uTools插件中来自应用的情况。 -->

## 解析引用格式

基于正则表达式拆解论文的引用格式。可能不准确，但是在大多数情况下（从谷歌学术中拷贝的引用）都能用。

测试用例可以参见[本项目下的regexp.js文件](https://ciaranchen.coding.net/public/dotfiles/utools_thesis_tools/git/files/master/regexp_test.js)

使用方法：

1. 复制论文的引用,呼出uTools菜单。
2. 如有识别：“APA引用”、“MLA引用”、“GB/T 7714引用”
3. 如无识别：“未知引用”
4. 选择内容以复制。

## Zotero-Search

连接Zotero数据库查询Zotero中的文献资料。（标题匹配）

使用方法：在uTools中使用关键字"zotero"或者"zs"。

## 建议

您的建议非常宝贵。如果您有任何新功能或者改进的建议，可以在uTools的评论区留言，我会尽力回复。

代码目前开源在：[coding.net](https://ciaranchen.coding.net/public/dotfiles/utools_thesis_tools/git/files)

## TODO

- 知网查是否为中科院核心
- EngineVillage查是否为EI
- 常见引用格式转换。
- Zotero-Search 搜索线上可同步的内容
- 从引用文献直接向 Zotero 添加内容
